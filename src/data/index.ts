
export const data: Array<ICard> = [{
    id: 1,
    status: "TO_DO",
    content: "Fill out human interest distribution form"
}, {
    id: 2,
    status: "TO_DO",
    content: "Get an anniversary gift"
}, {
    id: 3,
    status: "TO_DO",
    content: "Call the bank to talk about investments"
}, {
    id: 4,
    status: "TO_DO",
    content: "Finish reading Intro to UI/UX"
}];

export const CardStatuses = ["TO_DO", "IN_PROGRESS", "DONE"] as const;
export type CardStatus = typeof CardStatuses[number];

export type ICard = {
    id: number;
    status: CardStatus;
    content: string;
}