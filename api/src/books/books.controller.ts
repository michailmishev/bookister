import {
    Controller,
    HttpStatus,
    HttpCode,
    UsePipes,
    ValidationPipe,
    Post,
    Get,
    Put,
    Delete,
    Body,
    UseGuards,
    Query,
    Param,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { Book } from 'src/data/entities/book.entity';
import { CreateBookDTO } from '../models/books/create-book.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ShowBookWithoutReviewsDTO } from 'src/models/books/show-book-without-reviews.dto';
import { User } from 'src/data/entities/user.entity';
import { UserShowDTO } from 'src/models/user';
import { UsersService } from 'src/core/services/users.service';
import { IsAdmin } from 'src/common/decorators/is-admin.decorator';
import { UpdateBookDTO } from 'src/models/books/update-book.dto';
// import { Query } from 'typeorm/driver/Query';

@Controller('books')
export class BooksController {

    constructor(
        private bookService: BooksService,
        private usersService: UsersService,
    ) { }


    // CREATE BOOK
    @Post()
    @UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )
    @HttpCode(HttpStatus.CREATED)
    @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
    async create(
        @Body() book1: CreateBookDTO,
    ): Promise<any> {
        const createdBook: ShowBookWithoutReviewsDTO =  await this.bookService.createNewBook(book1);
        return {
            message: 'Book has been submitted successfully!',
            data: createdBook,
            };

    }



    // GET ALL BOOKS
    @Get()
    // @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async getBooks(
        @Query() query: any,
    ) {
        return this.bookService.getAllBooks(query);
    }



    //DELETE BOOK
    @Delete('/:bookId')
    @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
    @HttpCode(HttpStatus.OK)
    async deleteBook(
        @Param('bookId') bookId: string,
        @IsAdmin() isAdmin: boolean,
    ) {
        if (!isAdmin) {
            throw new UnauthorizedException('Books can be deleted only by the admin!');
        }
        const bookToDel = await this.bookService.deleteBook(bookId);
        if (!bookToDel) {
            throw new NotFoundException('Book does not exist!');
        }
        return {
                message: 'Book has been deleted successfully!',
                data: bookToDel,
        };
    }



    //EDIT BOOK
    @Put('/:bookId')
    @UseGuards(AuthGuard('jwt'), JwtAuthGuard)
    @UsePipes(
        new ValidationPipe({
            transform: true,
            whitelist: true,
        }),
    )
    async updateBook(
        @Param('bookId') bookId: string,
        @Body() updatedBook: UpdateBookDTO,
        @IsAdmin() isAdmin: boolean,
    ) {
        if (!isAdmin) {
            throw new UnauthorizedException('Books can be updated only by the admin!');
        }
        const updateBook = await this.bookService.updateBook(bookId, updatedBook);
        if (!updateBook) {
            throw new NotFoundException(`Book does not exist.`);
        }
        return {
            message: 'Book has been updated successfully!',
            data: updateBook,
        };
    }



}
