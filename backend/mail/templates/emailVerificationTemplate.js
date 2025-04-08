const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Verify Your CoRide Account</title>
		<style>
			body {
				background-color: #f8f9fa;
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				font-size: 16px;
				line-height: 1.6;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 30px;
				background-color: #ffffff;
				border-radius: 8px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
			}
	
			.header {
				text-align: center;
				padding-bottom: 20px;
				border-bottom: 1px solid #eeeeee;
				margin-bottom: 30px;
			}
	
			.logo {
				max-width: 180px;
				margin-bottom: 15px;
			}
	
			.message {
				font-size: 24px;
				font-weight: 600;
				color: #2c3e50;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 30px;
				color: #4a4a4a;
			}
	
			.otp-container {
				background-color: #f5f7f9;
				border-radius: 6px;
				padding: 15px;
				margin: 25px auto;
				width: 60%;
				text-align: center;
				border: 1px solid #e1e4e8;
			}
	
			.otp-code {
				letter-spacing: 5px;
				font-size: 28px;
				font-weight: bold;
				color: #3498db;
				margin: 10px 0;
				font-family: monospace;
			}
	
			.cta {
				display: inline-block;
				padding: 12px 25px;
				background-color: #3498db;
				color: #ffffff;
				text-decoration: none;
				border-radius: 6px;
				font-size: 16px;
				font-weight: 600;
				margin-top: 20px;
				transition: background-color 0.3s;
			}
	
			.cta:hover {
				background-color: #2980b9;
			}
	
			.expiry-notice {
				font-size: 14px;
				color: #e74c3c;
				margin: 20px 0;
				font-style: italic;
			}
	
			.support {
				font-size: 14px;
				color: #7f8c8d;
				margin-top: 30px;
				text-align: center;
				padding-top: 20px;
				border-top: 1px solid #eeeeee;
			}
	
			.footer {
				margin-top: 30px;
				text-align: center;
				font-size: 12px;
				color: #95a5a6;
			}
	
			.social-icons {
				margin: 15px 0;
			}
	
			.social-icon {
				display: inline-block;
				margin: 0 10px;
				width: 30px;
				height: 30px;
			}
	
			.highlight {
				font-weight: bold;
				color: #2c3e50;
			}
	
			.benefits {
				background-color: #f0f7ff;
				border-left: 4px solid #3498db;
				padding: 15px;
				margin: 20px 0;
				border-radius: 0 6px 6px 0;
			}
	
			.benefits-title {
				font-weight: 600;
				color: #2c3e50;
				margin-bottom: 10px;
			}
	
			.benefit-item {
				margin: 5px 0;
				display: flex;
				align-items: center;
			}
	
			.benefit-icon {
				color: #3498db;
				margin-right: 10px;
				font-weight: bold;
			}
	
			@media only screen and (max-width: 600px) {
				.container {
					padding: 20px;
				}
	
				.otp-container {
					width: 80%;
				}
	
				.message {
					font-size: 20px;
				}
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<div class="header">
				<div class="message">Verify Your CoRide Account</div>
			</div>
			<div class="body">
				<p>Hi there,</p>
				<p>Thanks for joining <span class="highlight">CoRide</span>, your campus community's trusted ride-sharing platform! Please verify your account with this one-time password:</p>
				
				<div class="otp-container">
					<div class="otp-code">${otp}</div>
				</div>
				
				<p class="expiry-notice">⏱️ This verification code expires in 5 minutes.</p>
				
				<div class="benefits">
					<div class="benefits-title">Why join the CoRide community?</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span> Save money on transportation with fellow students
					</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span> Reduce your carbon footprint
					</div>
					<div class="benefit-item">
						<span class="benefit-icon">✓</span> Meet new friends from your campus
					</div>
				</div>
				
				<p>If you didn't sign up for a CoRide account, you can safely ignore this email.</p>
				
				<p>Need help? Our support team is ready to assist you!</p>
			</div>
			
			<div class="support">
				<p>Questions or need assistance? Contact us at <a href="mailto:support@coride.com">support@coride.com</a> or reply to this email.</p>
			</div>
			
			<div class="footer">
				<p>© CoRide</p>
				<p>This is a transactional email related to your CoRide account. You received this because you signed up.</p>
			</div>
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
  
  