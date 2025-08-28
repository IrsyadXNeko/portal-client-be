import { ApiProperty } from "@nestjs/swagger";

export class CreateInvoiceDto {
  @ApiProperty({ example: '1', description: 'Client ID' })
  client_id: number;

  @ApiProperty({ example: 'Website Development - Phase 1', description: 'Invoice title' })
  title: string;
  
  @ApiProperty({ example: '50% payment for homepage UI/UX', description: 'Invoice description' })
  description?: string;
  
  @ApiProperty({ example: '500000', description: 'Invoice amount' })
  amount: number;
  
  @ApiProperty({ example: '2025-08-06', description: 'Invoice due date, format: "YYYY-MM-DD"' })
  due_date: string;
  
  @ApiProperty({ example: 'true', description: 'Invoice recurring if value is true' })
  is_recurring?: boolean;
  
  @ApiProperty({ example: 'monthly or yearly', description: 'Invoice recurring interval, filled with "monthly | yearly"' })
  recurring_interval?: 'monthly' | 'yearly';
}