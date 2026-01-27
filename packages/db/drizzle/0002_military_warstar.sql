ALTER TABLE "shapes" DROP CONSTRAINT "shapes_canvas_id_canvas_id_fk";
--> statement-breakpoint
ALTER TABLE "shapes" ALTER COLUMN "id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "shapes" ADD CONSTRAINT "shapes_canvas_id_canvas_id_fk" FOREIGN KEY ("canvas_id") REFERENCES "public"."canvas"("id") ON DELETE cascade ON UPDATE no action;