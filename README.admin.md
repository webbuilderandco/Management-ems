# Emmanuel Senior Secondary School Management System

The dedicated administrator panel is available at `/admin.html`.

**Demo administrator credentials**
- Username: `emmanuel`
- Password: `emmanuel@123`

The credentials above are a frontend demo and remain valid only for the current browser tab session. The password must not be considered production security. Before production deployment, use Firebase Authentication for password verification and create a custom `role: "admin"` claim or `users/{uid}.role = "admin"` record. Restrict Firestore and Storage operations through security rules and assign administrators through a server-side or Firebase Console workflow.
