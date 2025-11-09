export const getSubscriptionName = (subscriptionId: string) => {
  switch (subscriptionId) {
    case "9cc1a72a-96fc-4d07-ae0d-2f13cad572f2":
      return "pro";
    case "1991f990-dfb8-46dc-a5bc-799ee8f07437":
      return "gold";
    case "201afdb8-2dcc-45b0-b358-fa5482ac205e":
      return "enterprise";
    default:
      return "free";
  }
};
