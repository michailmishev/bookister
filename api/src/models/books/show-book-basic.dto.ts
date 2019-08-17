import { Expose } from 'class-transformer';
import { IsString, IsDate, IsBoolean } from 'class-validator';

export class ShowBookBasicDTO {

    @Expose()
    @IsString()
    id: string;

    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsString()
    author: string;

    @Expose()
    @IsString()
    topic: string;

    @Expose()
    @IsString()
    laguage: string;

    @Expose()
    @IsDate()
    timestamp: Date;

    @Expose()
    @IsString()
    averageRating: string;

    @Expose()
    @IsBoolean()
    isTaken: boolean;

}
