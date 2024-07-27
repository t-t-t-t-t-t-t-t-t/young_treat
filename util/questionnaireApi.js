// 问卷
import Request from "./http";
//问卷分页查询
export function getQuestionnaire(page = 1, pageSize = 5, search = 'search') {
	return Request({
		url: `/paper/papers?page=${page}&pageSize=${pageSize}&${search}`,
		method: "GET"
	})
}
export function submitQuestionnaire(answers) {
	return Request({
		url: `/paper/answer`,
		method: "POST",
		data: {
			answers
		}
	})
}