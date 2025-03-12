const response = <T>(data: T) => ({
  code: "500",
  data,
  message: "Placeholder data",
});
export const LoginMockData = response({
  access_token: "BwVIJ0H-4d5y4lzAtCr4S9QFOgd96VaEyLlB8F0ZPX9yymbgxfi9s3PcRXsQ",
  token_type: "Bearer",
  expires_in: 3599,
});
export const SendRegisterCodeMockData = response(null);
export const RegisterMockData = response({
  tenantId: null,
  userName: "",
  name: null,
  surname: null,
  email: "@example.com",
  emailConfirmed: false,
  phoneNumber: null,
  phoneNumberConfirmed: false,
  isActive: true,
  lockoutEnabled: true,
  accessFailedCount: 0,
  lockoutEnd: null,
  concurrencyStamp: "7a8594d800454b4e8d09b6baa4b61824",
  entityVersion: 2,
  lastPasswordChangeTime: "2025-03-10T08:23:14.479257+00:00",
  isDeleted: false,
  deleterId: null,
  deletionTime: null,
  lastModificationTime: "2025-03-10T16:23:15.12322+08:00",
  lastModifierId: null,
  creationTime: "2025-03-10T16:23:14.862625+08:00",
  creatorId: null,
  id: "22c8d81e-e085-66d9-d916-3a1891537e9a",
  extraProperties: {},
});
