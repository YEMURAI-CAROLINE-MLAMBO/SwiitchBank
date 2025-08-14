#!/bin/bash

# Initialize Git repository
git init

# Create directory structure
mkdir -p backend/{src/{config,controllers,middleware,models,routes,services,utils,jobs},migrations,tests}
mkdir -p frontend/{public,src/{components/{common,dashboard,cards,kyc,wallet,growth,onboarding},context,hooks,pages,services,utils,styles}}
mkdir -p docker

# Create empty files
touch backend/.env.example
touch backend/package.json
touch backend/server.js
touch backend/src/app.js
touch backend/src/config/{database.js,environment.js,security.js}
touch backend/src/controllers/{authController.js,cardController.js,kycController.js,transactionController.js,walletController.js,growthController.js}
touch backend/src/middleware/{auth.js,compliance.js,rateLimiter.js,validation.js}
touch backend/src/models/{Card.js,Transaction.js,User.js,Wallet.js}
touch backend/src/routes/{auth.js,cards.js,kyc.js,transactions.js,wallet.js,growth.js}
touch backend/src/services/{cardService.js,cryptoService.js,kycService.js,notificationService.js,walletService.js,aiService.js,referralService.js,contentService.js,feedbackService.js,influencerService.js,growthService.js}
touch backend/src/utils/{encryption.js,logger.js,validators.js}
touch backend/src/jobs/growthLoopJob.js

touch frontend/.env.example
touch frontend/package.json
touch frontend/public/{favicon.ico,index.html}
touch frontend/src/{App.jsx,index.jsx,setupProxy.js}
touch frontend/src/components/common/{Button.jsx,Input.jsx,LoadingSpinner.jsx,Modal.jsx}
touch frontend/src/components/dashboard/{Dashboard.jsx,TransactionHistory.jsx,WalletBalance.jsx}
touch frontend/src/components/cards/{CardList.jsx,IssueCardModal.jsx,VirtualCard.jsx}
touch frontend/src/components/kyc/{KYCForm.jsx,DocumentUpload.jsx}
touch frontend/src/components/wallet/{CurrencyConverter.jsx,TopUpModal.jsx,WalletOverview.jsx}
touch frontend/src/components/growth/{ReferralProgram.jsx,BankingCircle.jsx,SavingsChallenge.jsx}
touch frontend/src/components/onboarding/StudentOnboarding.jsx
touch frontend/src/context/{AuthContext.jsx,WalletContext.jsx}
touch frontend/src/hooks/{useAuth.js,useWallet.js}
touch frontend/src/pages/{Dashboard.jsx,Login.jsx,Register.jsx,KYCVerification.jsx}
touch frontend/src/services/{api.js,auth.js,cards.js,wallet.js}
touch frontend/src/utils/{constants.js,formatters.js,validators.js}
touch frontend/src/styles/{globals.css,components.css}

touch docker/{backend.Dockerfile,frontend.Dockerfile}
touch docker-compose.yml
touch .dockerignore
touch .gitignore
touch README.md
touch setup.sh

# Make setup script executable
chmod +x setup.sh

echo "SwiitchBank project structure created successfully!"