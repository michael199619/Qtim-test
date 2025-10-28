import { Column,CreateDateColumn,DeleteDateColumn,Entity,PrimaryGeneratedColumn,UpdateDateColumn } from "typeorm";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar',select: false })
    password: string;

    @Column({ type: 'varchar' })
    login: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'bool',nullable: true })
    isDeleted: string;

    @DeleteDateColumn()
    deletedAt: string;

    @UpdateDateColumn()
    updatedAt: string;

    @CreateDateColumn()
    createdAt: string;
}