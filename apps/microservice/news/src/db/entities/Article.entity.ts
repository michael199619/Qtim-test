import { Column,CreateDateColumn,Entity,PrimaryGeneratedColumn,UpdateDateColumn } from "typeorm";

enum ArticleStatus {
    DRAFT='draft',
    PUBLISH='publish'
}

@Entity('article')
export class Article {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar',select: false })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'text',default: '' })
    content: string;

    @Column({ type: 'uuid' })
    authorId: string;

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