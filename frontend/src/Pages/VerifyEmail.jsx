import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { sendOtp, signUp } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [otp, setOtp] = useState("");
  const { signupData, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // it will check that all data are present or not if not then it will render in signup by usin useEffet()

  useEffect(() => {
    // Only allow access of this route when user has filled the signup form
    if (!signupData) {
      navigate("/signup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleVerifyAndSignup = (e) => {
    e.preventDefault();
    const {
        fullName,
        email,
        phone,
        collegeName,
        collegeId,
        password,
        confirmPassword,
        preferredGender,
        emergencyContact,
    } = signupData;

    dispatch(
      signUp(
        fullName,
        email,
        phone,
        collegeName,
        collegeId,
        password,
        confirmPassword,
        preferredGender,
        emergencyContact,
        otp,
        navigate
      )
    );
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center bg-richblack-900 px-4 py-8">
      {loading ? (
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-t-blue-500 border-richblack-400/30 rounded-full animate-spin"></div>
          <p className="text-richblack-5 mt-4 font-medium">Verifying your account</p>
        </div>
      ) : (
        <div className="w-full max-w-[550px] bg-richblack-800 border border-richblack-700 rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-richblack-700 p-6 border-b border-richblack-600">
            <h1 className="text-richblack-5 font-bold text-2xl flex items-center gap-3">
              <div className="bg-blue-500 rounded-full p-2">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-white">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                </svg>
              </div>
              Email Verification
            </h1>
          </div>

          {/* Content */}
          <div className="p-6">
            <div className="mb-6 bg-richblack-900/50 p-4 rounded-lg border border-richblack-700">
              <p className="text-richblack-50">
                A verification code has been sent to <span className="text-blue-400 font-medium">{signupData?.email || "your email"}</span>
              </p>
            </div>

            <form onSubmit={handleVerifyAndSignup} className="space-y-6">
              <div>
                <label htmlFor="otp-input" className="block text-richblack-50 text-sm font-medium mb-2">
                  Enter your 6-digit verification code:
                </label>
                <div className="bg-richblack-900/50 p-4 rounded-lg">
                  <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    shouldAutoFocus
                    inputType="text"
                    renderInput={(props) => (
                      <input
                        {...props}
                        id="otp-input"
                        placeholder="-"
                        maxLength={1}
                        className="w-[80px] md:w-[80px] h-[50px] text-2xl border border-richblack-600 bg-richblack-700 rounded-md text-richblack-5 text-center focus:border-blue-500 focus:outline-none"
                      />
                    )}
                    containerStyle={{
                      justifyContent: "center",
                      gap: "10px"
                    }}
                  />
                </div>
                
                {/* Status indicator */}
                {/* <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-richblack-400">
                    {otp.length === 6 ? (
                      <span className="text-green-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                        </svg>
                        Code complete
                      </span>
                    ) : (
                      `${otp.length}/6 digits entered`
                    )}
                  </span>
                </div> */}
              </div>
              
              <button
                type="submit"
                disabled={otp.length !== 6 || loading}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
                  otp.length === 6 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-richblack-700 text-richblack-400 cursor-not-allowed'
                } transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing
                  </span>
                ) : "Verify Email"} 
              </button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-4 border-t border-richblack-700 flex flex-col sm:flex-row items-center justify-between gap-4">
              <Link to="/signup" className="flex items-center text-richblack-300 hover:text-blue-400 transition-colors">
                <BiArrowBack className="mr-2" />
                Back to Signup
              </Link>
              
              <button
                className="flex items-center text-richblack-300 hover:text-blue-400 transition-colors"
                onClick={() => dispatch(sendOtp(signupData?.email))}
              >
                <RxCountdownTimer className="mr-2" />
                Resend Code
              </button>
            </div>
            
            <div className="mt-6 text-center text-sm text-richblack-400">
              Need help? <a href="#" className="text-blue-400 hover:underline">Contact Support</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VerifyEmail;
