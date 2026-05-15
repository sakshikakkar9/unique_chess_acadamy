export interface StudentImportColumn {
  field: string;        // exact Prisma field name
  label: string;        // human-readable header
  aliases: string[];    // common Excel column names that map here
  required: boolean;
  type: 'string' | 'number' | 'date' | 'email' | 'phone';
  example: string;
}

export const STUDENT_IMPORT_COLUMNS: StudentImportColumn[] = [
  {
    field: 'fullName',
    label: 'Full Name',
    aliases: ['fullName', 'full name', 'student name', 'name', 'Student Name', 'Full Name'],
    required: true,
    type: 'string',
    example: 'Arjun Sharma',
  },
  {
    field: 'email',
    label: 'Email',
    aliases: ['email', 'email address', 'e-mail', 'Email Address'],
    required: false,
    type: 'email',
    example: 'arjun@email.com',
  },
  {
    field: 'phone',
    label: 'Phone',
    aliases: ['phone', 'mobile', 'contact', 'phone number', 'Mobile Number', 'Phone Number'],
    required: true,
    type: 'phone',
    example: '9876543210',
  },
  {
    field: 'gender',
    label: 'Gender',
    aliases: ['gender', 'sex', 'Gender (Male/Female)'],
    required: true,
    type: 'string',
    example: 'Male',
  },
  {
    field: 'dob',
    label: 'Date of Birth',
    aliases: ['dob', 'date of birth', 'birth date', 'Birthday'],
    required: true,
    type: 'date',
    example: '15/08/2010',
  },
  {
    field: 'address',
    label: 'Address',
    aliases: ['address', 'location', 'residence'],
    required: true,
    type: 'string',
    example: '123, MG Road, Bangalore',
  },
  {
    field: 'fideId',
    label: 'FIDE ID',
    aliases: ['fideId', 'fide id', 'FIDE ID'],
    required: false,
    type: 'string',
    example: '12345678',
  },
  {
    field: 'fideRating',
    label: 'FIDE Rating',
    aliases: ['fideRating', 'fide rating', 'rating', 'Rating'],
    required: false,
    type: 'number',
    example: '1200',
  },
  {
    field: 'clubAffiliation',
    label: 'Club Affiliation',
    aliases: ['clubAffiliation', 'club', 'academy', 'School/Club'],
    required: false,
    type: 'string',
    example: 'Unique Chess Academy',
  },
  {
    field: 'experienceLevel',
    label: 'Experience Level',
    aliases: ['experienceLevel', 'experience', 'level', 'Level (Beginner/Intermediate/Advanced)'],
    required: false,
    type: 'string',
    example: 'Intermediate',
  },
  {
    field: 'preferredBatch',
    label: 'Preferred Batch',
    aliases: ['preferredBatch', 'batch', 'Preferred Batch'],
    required: false,
    type: 'string',
    example: 'Weekend Evening',
  },
  {
    field: 'discoverySource',
    label: 'Discovery Source',
    aliases: ['discoverySource', 'source', 'how did you find us', 'Discovery Source'],
    required: false,
    type: 'string',
    example: 'Social Media',
  }
];

export const TEMPLATE_HEADERS = STUDENT_IMPORT_COLUMNS.map(col => col.label);
