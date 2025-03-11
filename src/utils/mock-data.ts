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
