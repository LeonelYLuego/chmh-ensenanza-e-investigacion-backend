import { ApiProperty } from '@nestjs/swagger';

/** Estructure of the http response */
export class HttpResponse<T> {
  /** @property {T} data Data of the response */
  @ApiProperty({ description: 'Response data' })
  data?: T;

  /** @Property Error response */
  @ApiProperty({ description: 'Response error' })
  error?: {
    statusCode: number;
    timestamp: string;
    path: string;
    exception: any;
  };
}
