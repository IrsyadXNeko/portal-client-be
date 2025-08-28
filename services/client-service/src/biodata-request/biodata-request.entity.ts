export class BiodataUpdateRequest {
    id: number;
    client_id: number;
    new_company_name: string;
    new_contact_person: string;
    new_phone: string;
    new_address: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: Date;
}
