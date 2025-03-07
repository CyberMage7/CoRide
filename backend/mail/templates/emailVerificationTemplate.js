const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			// <a href="https://studynotion-edtech-project.vercel.app"><img class="logo"
			// 		src="https://i.ibb.co/7Xyj3PC/logo.png" alt="StudyNotion Logo"></a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with StudyNotion. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:info@corider.com">info@corider.com</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;


/**
 * Email verification template

//  */
// const emailVerificationTemplate = (name, otp) => {
// 	return `
// 	  <!DOCTYPE html>
// 	  <html>
// 	  <head>
// 		<meta charset="utf-8">
// 		<title>Email Verification</title>
// 		<style>
// 		  body {
// 			font-family: Arial, sans-serif;
// 			line-height: 1.6;
// 			color: #333;
// 			max-width: 600px;
// 			margin: 0 auto;
// 			padding: 20px;
// 		  }
// 		  .container {
// 			border: 1px solid #ddd;
// 			border-radius: 5px;
// 			padding: 20px;
// 		  }
// 		  .header {
// 			text-align: center;
// 			padding-bottom: 10px;
// 			border-bottom: 1px solid #eee;
// 			margin-bottom: 20px;
// 		  }
// 		  .otp {
// 			font-size: 24px;
// 			font-weight: bold;
// 			text-align: center;
// 			letter-spacing: 5px;
// 			margin: 20px 0;
// 			padding: 10px;
// 			background-color: #f5f5f5;
// 			border-radius: 5px;
// 		  }
// 		  .footer {
// 			margin-top: 30px;
// 			text-align: center;
// 			font-size: 12px;
// 			color: #777;
// 		  }
// 		</style>
// 	  </head>
// 	  <body>
// 		<div class="container">
// 		  <div class="header">
// 			<h2>Email Verification</h2>
// 		  </div>
// 		  <p>Hello ${name},</p>
// 		  <p>Thank you for registering. Please use the following OTP to verify your email address:</p>
// 		  <div class="otp">${otp}</div>
// 		  <p>This OTP will expire in 10 minutes.</p>
// 		  <p>If you did not request this verification, please ignore this email.</p>
// 		  <div class="footer">
// 			<p>&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
// 		  </div>
// 		</div>
// 	  </body>
// 	  </html>
// 	`
//   }
  
//   export default emailVerificationTemplate
  
  