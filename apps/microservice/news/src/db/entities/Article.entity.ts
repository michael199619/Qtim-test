import { Column,CreateDateColumn,Entity,PrimaryGeneratedColumn,UpdateDateColumn } from "typeorm";

enum ArticleStatus {
    DRAFT='draft',
    PUBLISH='publish'
}

@Entity('article')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar',select: false })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'numeric' })
    authorId: number;

    @Column({ type: 'date',nullable: true })
    publishedAt: Date;

    @Column({ type: 'date',nullable: true })
    publishesdAt: Date;

    @Column({ enum: ArticleStatus })
    status: ArticleStatus;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}