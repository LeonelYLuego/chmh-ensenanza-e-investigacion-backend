import { ApiProperty } from "@nestjs/swagger";
import { CurrentUserDto } from "@users/dtos";

export class ResponseLogInDto {
    @ApiProperty({type: String})
    token: string;

    @ApiProperty({type: CurrentUserDto})
    user: CurrentUserDto;
}