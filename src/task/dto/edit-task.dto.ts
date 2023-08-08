import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class EditTaskDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsDate()
    @IsOptional()
    date?: Date;

    @IsBoolean()
    @IsOptional()
    completed?: boolean;
}