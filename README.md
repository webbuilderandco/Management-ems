# Emmanuel Senior Secondary School Management System

A responsive school portal for teacher and student workflows: dashboard, student records, attendance register, academic reports, class timetable and shared school resources.

## Run locally

```bash
npm install
npm run dev
```

Firebase web configuration is set in `src/firebase.js` from the configuration supplied for project `ems-f787e`. Enable **Email/Password** in Firebase Authentication, create a Firestore database and enable Firebase Storage before using the live data features. Build for deployment with `npm run build`.

## Firebase collections

- `users/{uid}`: account display name, email and role (`Teacher` or `Student`).
- `students/{id}`: student name, student ID, class, email and attendance display status.
- `attendance/{id}`: student, date, status, and the authenticated user who marked it.
- `resources/{id}`: uploaded file title, category, download URL and uploader.
- Files are stored under `school-resources/` in Firebase Storage.

## Security before production

Firebase client configuration is not a secret. **Firestore and Storage security rules are the access-control boundary.** Configure rules before entering real student data: require authenticated users; restrict roster/attendance writes to authorized staff; limit student reads to their own records; validate document fields and file type/size; and restrict uploads to authorized staff. Do not deploy with open test-mode rules. Account self-registration is provided for development; for a real school, staff should provision accounts and assign roles securely rather than trusting a role chosen at signup.
