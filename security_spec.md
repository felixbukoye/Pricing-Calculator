# Security Specification

## 1. Data Invariants
1. **Identity Isolation**: A user can only access, create, read, update, and delete their own `/users/{userId}` documents, `/users/{userId}/files/{fileId}` documents, and `/users/{userId}/calculations/{calcId}` documents.
2. **Owner Immutability**: The `userId` field inside any entity must match `request.auth.uid` and cannot be modified once set.
3. **Master Gate / Path Consistency**: Document creation under `/users/{userId}/...` must enforce that the path `{userId}` matches `request.auth.uid` AND `incoming().userId == request.auth.uid`.
4. **ID Sanitization**: All document IDs (`userId`, `fileId`, `calcId`) must match `^[a-zA-Z0-9_\-]+$` and not exceed 128 characters.
5. **Payload Bounds**: All string fields are constrained with max lengths; numerical fields like `fileSize`, `batchUnits` must be non-negative numbers.

## 2. The Dirty Dozen Payloads (Expected: PERMISSION_DENIED)

1. **Unauthenticated Read on User Profile**:
   `GET /users/user_abc` without `request.auth`
2. **Cross-User Profile Hijack**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_456` with `{ "userId": "user_456", "email": "victim@test.com" }`
3. **Cross-User File Injection**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_456/files/file_1`
4. **Foreign UID in User Payload**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_123/files/file_1` with payload `{ "userId": "user_456", ... }`
5. **Unauthenticated File List**:
   `GET /users/user_123/files` without auth token.
6. **Cross-User File Delete**:
   `request.auth.uid == 'attacker'`, attempts `DELETE /users/victim/files/file_secret`
7. **Junk ID Resource Exhaustion**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_123/files/invalid$$%^&` (violating `isValidId`)
8. **Oversized String Injection**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_123/files/file_1` with `fileName` of 100,000 characters.
9. **Negative File Size**:
   `request.auth.uid == 'user_123'`, attempts `POST /users/user_123/files/file_1` with `fileSize: -500`
10. **Immutable Owner Modification on Update**:
    `request.auth.uid == 'user_123'`, attempts `PATCH /users/user_123/files/file_1` modifying `userId` to `user_hacker`
11. **Cross-User Calculation Scraping**:
    `request.auth.uid == 'user_123'`, attempts `GET /users/user_456/calculations/calc_1`
12. **Root Collection Unauthorized Write**:
    `request.auth.uid == 'user_123'`, attempts `POST /secret_admin_data/leak` (default deny catch-all)

## 3. Test Runner Specification
All 12 malicious requests listed above are validated against the rule set and will systematically return `PERMISSION_DENIED`.
