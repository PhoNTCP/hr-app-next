-- CreateTable
CREATE TABLE "public"."Keyword" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "fallback" TEXT,
    "templateId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'A',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Keyword_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MessageTemplate" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MessageTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Keyword_keyword_key" ON "public"."Keyword"("keyword");

-- CreateIndex
CREATE UNIQUE INDEX "MessageTemplate_name_key" ON "public"."MessageTemplate"("name");

-- AddForeignKey
ALTER TABLE "public"."Keyword" ADD CONSTRAINT "Keyword_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."MessageTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;
