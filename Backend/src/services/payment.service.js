import { Payment } from "../models/Payment.js";
import { Subscription } from "../models/Subscription.js";

export async function submitPayment({
  userId,
  amount,
  currency,
  provider,
  transactionReference,
  receiptUrl,
  clientMutationId
}) {
  if (clientMutationId) {
    const existing = await Payment.findOne({
      userId,
      clientMutationId
    });
    if (existing) {
      return { payment: existing, replayed: true };
    }
  }

  const payment = await Payment.create({
    userId,
    amount,
    currency: String(currency).trim().toUpperCase(),
    provider,
    transactionReference: transactionReference ? String(transactionReference).trim() : undefined,
    receiptUrl,
    clientMutationId,
    status: "pending"
  });

  return { payment, replayed: false };
}

export async function listPayments(user, filter = {}) {
  const query = { ...filter };
  if (user.role === "student") {
    query.userId = user._id;
  }
  return Payment.find(query).sort({ submittedAt: -1 }).limit(200);
}

export async function updatePaymentStatus(paymentId, status, reviewerUser, rejectionReason) {
  const payment = await Payment.findById(paymentId);
  if (!payment) {
    const error = new Error("Payment record not found.");
    error.status = 404;
    throw error;
  }

  payment.status = status;
  payment.reviewedBy = reviewerUser._id;
  payment.reviewedAt = new Date();
  if (rejectionReason) payment.rejectionReason = rejectionReason;
  await payment.save();

  if (status === "verified") {
    const oneYearFromNow = new Date();
    oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);

    await Subscription.findOneAndUpdate(
      { userId: payment.userId },
      {
        plan: "euee_unlimited",
        status: "active",
        startDate: new Date(),
        endDate: oneYearFromNow,
        paymentId: payment._id
      },
      { upsert: true, new: true }
    );
  }

  return payment;
}
