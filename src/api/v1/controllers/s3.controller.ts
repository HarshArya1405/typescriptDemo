// Import necessary modules and types
import { Body, JsonController, Post } from 'routing-controllers';
import { IsNotEmpty, IsString } from 'class-validator';
import { getSignedUrlForUpload } from '../../../util/s3Utils';
// Define query parameters for getting protocols
class S3Body {
    @IsNotEmpty()
    @IsString()
    public fileType!: string;
}

// Controller for protocol endpoints
@JsonController('/api/v1/s3')
export class S3Controller {
    /**
     * Endpoint to fetch and dump protocol data
     * @returns Success message
     */
    @Post('/getUploadSignedUrl')
    public async fetchAndDumpData(@Body() body: S3Body): Promise<object> {
        return await getSignedUrlForUpload(body);
    }
}
