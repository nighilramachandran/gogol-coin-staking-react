export const permessionsChecker = (role: string): Record<string, boolean> => {
  switch (role) {
    case "VIEWER":
      return {
        isAdmin: false,
        isView: true,
        isKyc: false,
        isStaking: false,
      }
    case "ADMIN":
      return {
        isAdmin: true,
        isView: true,
        isKyc: true,
        isStaking: true,
      }
    case "KYC":
      return {
        isAdmin: false,
        isView: true,
        isKyc: true,
        isStaking: false,
      }
    case "KYCSTAKING":
      return {
        isAdmin: false,
        isView: true,
        isKyc: true,
        isStaking: true,
      }
    default:
      return {
        isAdmin: false,
        isView: false,
        isKyc: false,
        isStaking: false,
      }
  }
}
