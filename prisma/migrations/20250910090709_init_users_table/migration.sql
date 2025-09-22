-- AlterTable
ALTER TABLE "public"."InitUser" ADD COLUMN     "bank_no" TEXT,
ADD COLUMN     "bot" TEXT,
ADD COLUMN     "company_phone_no" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "emp_code" TEXT,
ADD COLUMN     "eng_name" TEXT,
ADD COLUMN     "eng_surname" TEXT,
ADD COLUMN     "internal_extension" TEXT,
ADD COLUMN     "line" TEXT,
ADD COLUMN     "nick_name" TEXT,
ADD COLUMN     "personal_phone_no" TEXT,
ADD COLUMN     "status" TEXT,
ALTER COLUMN "title" DROP NOT NULL;
