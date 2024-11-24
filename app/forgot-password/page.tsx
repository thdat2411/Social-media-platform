import ForgotPasswordFooter from "./footer";
import ForgotPasswordForm from "./form";
import ForgotPasswordHeader from "./header";

const ForgotPassword = () => {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <ForgotPasswordHeader />
      <ForgotPasswordForm />
      <ForgotPasswordFooter />
    </div>
  );
};

export default ForgotPassword;
