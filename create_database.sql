CREATE TABLE "users" (
	"id" serial NOT NULL,
	"name" varchar(60) NOT NULL,
	"email" varchar(60) NOT NULL UNIQUE,
	"cpf" varchar(11) NOT NULL UNIQUE,
	"password" TEXT NOT NULL UNIQUE,
	CONSTRAINT "users_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sessions" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	"token" uuid NOT NULL UNIQUE,
	CONSTRAINT "sessions_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "categories" (
	"id" serial NOT NULL,
	"type" varchar(60) NOT NULL UNIQUE,
	CONSTRAINT "categories_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "products" (
	"id" serial NOT NULL,
	"name" varchar(60) NOT NULL UNIQUE,
	"category_id" integer NOT NULL,
	"price" DECIMAL NOT NULL,
	"image" TEXT NOT NULL,
	CONSTRAINT "products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sales" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL,
	"time" timestamp with time zone NOT NULL DEFAULT 'now()',
	CONSTRAINT "sales_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "sales_products" (
	"id" serial NOT NULL,
	"sale_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer NOT NULL DEFAULT '1',
	CONSTRAINT "sales_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "carts" (
	"id" serial NOT NULL,
	"user_id" integer NOT NULL UNIQUE,
	CONSTRAINT "carts_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

CREATE TABLE "carts_products" (
	"id" serial NOT NULL,
	"cart_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	CONSTRAINT "carts_products_pk" PRIMARY KEY ("id")
) WITH (
  OIDS=FALSE
);

ALTER TABLE "sessions" ADD CONSTRAINT "sessions_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "products" ADD CONSTRAINT "products_fk0" FOREIGN KEY ("category_id") REFERENCES "categories"("id");

ALTER TABLE "sales" ADD CONSTRAINT "sales_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "sales_products" ADD CONSTRAINT "sales_products_fk0" FOREIGN KEY ("sale_id") REFERENCES "sales"("id");
ALTER TABLE "sales_products" ADD CONSTRAINT "sales_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");

ALTER TABLE "carts" ADD CONSTRAINT "carts_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("id");

ALTER TABLE "carts_products" ADD CONSTRAINT "carts_products_fk0" FOREIGN KEY ("cart_id") REFERENCES "carts"("id");
ALTER TABLE "carts_products" ADD CONSTRAINT "carts_products_fk1" FOREIGN KEY ("product_id") REFERENCES "products"("id");