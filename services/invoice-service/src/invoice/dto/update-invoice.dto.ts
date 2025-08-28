import { ApiProperty } from "@nestjs/swagger";

export class UpdateInvoiceDto {
  @ApiProperty({ example: 'Website Development - Phase 1', description: 'Invoice title' })
  title?: string;
  
  @ApiProperty({ example: '50% payment for homepage UI/UX', description: 'Invoice description' })
  description?: string;
  
  @ApiProperty({ example: '500000', description: 'Invoice amount' })
  amount?: number;
  
  @ApiProperty({ example: 'unpaid', description: 'Invoice status payment, filled with "unpaid | paid | overdue"' })
  status?: 'unpaid' | 'paid' | 'overdue';
  
  @ApiProperty({ example: '2025-08-06', description: 'Invoice due date, format: "YYYY-MM-DD"' })
  due_date?: string;
}