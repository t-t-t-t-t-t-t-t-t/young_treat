// 用户Api
import Request from "./http";
export function getUserTag() {
	return Request({
		url: "/user/mark",
		method: "GET"
	})
}