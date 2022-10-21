import { User } from "@prisma/client";

const cleanArray = (arr: any[]) => {
    let newArray: User[] = [];
    for (const item in arr) {
        const repeated = newArray.some((i) => {
            return i.id === arr[+item].id;
        });
        if (!repeated) {
            newArray.push(arr[+item]);
        }
    }
    return newArray.reverse();
};

export default cleanArray;
