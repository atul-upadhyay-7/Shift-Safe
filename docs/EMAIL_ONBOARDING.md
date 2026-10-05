# Email-link-only onboarding

New Google users must confirm the same Google email, then open a Firebase address-verification email to unlock Work Profile. Signing in, an existing email_verified flag, a raw challenge/continue URL, or a client-side flag does not authorize registration. Existing registered workers can still sign in normally.

## Firebase setup after deployment

In the existing Firebase Authentication project:

1. Keep the project on Spark. No Blaze upgrade, card, or paid email sender is needed for built-in address-verification mail.
2. Confirm the app's deployment domain is in Authentication > Settings > Authorized domains.
3. In Authentication > Templates > Email address verification, set the custom Action URL to the deployed app's `/auth/email` page. Do not leave the default hosted handler in place: it would consume the action code before the app can validate it.
4. Keep `NEXT_PUBLIC_FIREBASE_API_KEY` and `FIREBASE_PROJECT_ID` on the same Firebase project as Google sign-in.
5. Test a real new-user Google sign-in, email request, received link and registration before calling delivery verified. Emulator results are not evidence of production inbox delivery.

The app uses VERIFY_EMAIL, not EMAIL_SIGNIN. Firebase's documented Spark quota at implementation time is 1,000 address-verification emails/day; email-sign-in links have a separate much smaller quota. Limits can change. The app conservatively caps email requests at 100/day across the app, 5/day per Firebase user and a 60-second per-user cooldown. Days are UTC. Failed or uncertain sends consume app budget. Do not raise caps or upgrade billing without owner approval.

## Security and expiry

A challenge binds the Firebase user ID, email, name and contact phone. Email links have a 30-minute app challenge window. The server checks the Firebase code's VERIFY_EMAIL purpose and email, then applies the code and matches the returned localId and verified email before issuing a one-use, 60-minute registration grant. No ID token, provider code or secret is logged or stored in the database. Only hashes of challenges and grants are stored. The action page never verifies on a GET or preview, and uses no-referrer. A person must confirm the opened link. Expired, invalid, mismatched and replayed links fail closed.

The grant can hand off in a different browser/device using the email link; subsequent registration still needs the entered work profile. The local browser keeps the grant in sessionStorage for refresh recovery during its one-hour lifetime and removes it after registration. Closing that browser session requires requesting a new link. A database/provider outage during redemption may consume the provider code without completing the grant; the recovery is a new link, never bypassing verification.

Email verification proves current inbox access, not unique-human identity, delivery-worker status, insurance KYC or payout-account ownership. Contact phone verification remains a separate optional trial feature. No active cover, payments or payouts are enabled by this change.

Sources:
- https://firebase.google.com/docs/auth/custom-email-handler
- https://firebase.google.com/docs/reference/rest/auth
- https://firebase.google.com/docs/auth/limits
- https://firebase.google.com/docs/auth/web/manage-users
