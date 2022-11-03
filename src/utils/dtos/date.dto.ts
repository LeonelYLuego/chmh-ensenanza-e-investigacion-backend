import { Matches } from "class-validator";

export class DateDto {
    @Matches(/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/)
    date: Date;
}