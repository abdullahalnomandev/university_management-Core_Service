import { RedisClient } from "../../../shared/redis";
import { EVENT_STUDENT_CREATED } from "./student.constant";
import { StudentService } from "./student.service";

const initStudentEvents = async () =>{
    RedisClient.subscribe(EVENT_STUDENT_CREATED,async (e:string) =>{
        const data = JSON.parse(e);

        await StudentService.createStudentFromEvent(data)

        console.log('data',data);
    })
}


export default initStudentEvents;