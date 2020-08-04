export type AppState = {
  returnTo?: string;
};

export function useApp() {
  return {
    welcomeMessage: 'Welcome_msg',
  };
}
