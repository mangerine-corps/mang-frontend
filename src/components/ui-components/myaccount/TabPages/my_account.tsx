import FeedbackOverviewcompTwo from "../../mybusiness/feedbackoverviewcomptwo";
import MyAccount from "../../myaccount";

function MyAccounts({ page }: { page: string }) {
  return {
    ["feedback"]: <FeedbackOverviewcompTwo />,
    ["payment"]: <MyAccount />,
  }[page];
}

export default MyAccounts;
