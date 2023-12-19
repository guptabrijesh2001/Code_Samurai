import { atom } from "recoil";

type AuthModalState = {
	isOpen: boolean;
	type: "login" | "register" | "forgotPassword";
};

const initalAuthModalState: AuthModalState = {
	isOpen: false,
	type: "login",
};

export const authModalState = atom<AuthModalState>({
	key: "authModalState",
	default: initalAuthModalState,
});

export const codeuser = atom({
  key: 'codeuser',
  default: 'gbebgbfgbg',
});
export const help = atom({
	key: 'help',
	default: 'gbebgbfgbg',
  });