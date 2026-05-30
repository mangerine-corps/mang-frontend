import FeedbackOverviewcompTwo from "../../mybusiness/feedbackoverviewcomptwo";
import PaymentSetting from "../../paymentsetting";

function MyAccounts({ page }: { page: string }) {
  return {
    ["feedback"]: <FeedbackOverviewcompTwo />,
    ["payment"]: <PaymentSetting />,
  }[page];
}

export default MyAccounts;
