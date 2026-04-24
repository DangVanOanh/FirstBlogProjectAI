# Personal Blog Project

## Tổng quan
Blog cá nhân 1 tác giả, bài viết public, có bình luận và tag.

## Cách chạy project

### Backend
```bash
cd D:\AI\ClaudeAI\Blog\PersonalBlog.API
dotnet run --launch-profile https
# Swagger: https://localhost:5001/swagger
# Tài khoản: admin / Admin@123
```

### Frontend
```bash
cd D:\AI\ClaudeAI\Blog\frontend
npm run dev
# URL: http://localhost:3000
```

> Backend phải chạy trước frontend. Frontend proxy /api → http://localhost:5000

## Tech Stack
| Tầng | Công nghệ |
|------|-----------|
| Backend | ASP.NET Core 8 Web API (C#) |
| Frontend | React 18 + TypeScript + Vite |
| UI | Tailwind CSS v3 |
| Database | SQL Server (EF Core 8) |
| Auth | JWT (24h expiry) |
| Validation | FluentValidation |
| Logging | Serilog (console + file logs/) |

## Cấu trúc Backend

```
PersonalBlog.API/
├── Common/
│   ├── Exceptions/     # AppException, NotFoundException, ValidationException, UnauthorizedException
│   ├── Models/         # ApiResponse<T> — wrapper cho mọi response
│   └── Extensions/     # ServiceExtensions — đăng ký DI theo nhóm
├── Middleware/
│   └── ErrorHandlingMiddleware.cs  # Bắt exception → ApiResponse chuẩn
├── Controllers/        # AuthController, PostsController, TagsController, CommentsController
├── Data/
│   ├── AppDbContext.cs
│   └── Configurations/ # EF Fluent API: PostConfiguration, TagConfiguration, CommentConfiguration
├── DTOs/               # Auth/, Posts/, Tags/, Comments/
├── Helpers/
│   └── SlugHelper.cs
├── Models/             # User, Post, Tag, PostTag, Comment
├── Repositories/
│   ├── Interfaces/     # IPostRepository, ITagRepository, ICommentRepository
│   └── Implementations/
├── Services/
│   ├── Interfaces/     # IPostService, ITagService, ICommentService, IAuthService
│   └── Implementations/
├── Validators/         # PostValidators, TagValidators, CommentValidators (FluentValidation)
├── appsettings.json
└── appsettings.Development.json
```

## Cấu trúc Frontend

```
frontend/src/
├── api/                # client.ts (axios), posts.api.ts, tags.api.ts, comments.api.ts, auth.api.ts
├── store/
│   └── AuthContext.tsx # React Context quản lý auth state (isLoggedIn, login, logout)
├── components/
│   ├── common/         # ErrorBoundary, LoadingSpinner, ProtectedRoute
│   ├── layout/         # Layout.tsx (bọc toàn app), Navbar.tsx
│   └── features/
│       ├── post/       # PostCard.tsx
│       └── comment/    # CommentSection.tsx
├── pages/
│   ├── public/         # HomePage, PostDetailPage, SearchPage
│   ├── auth/           # LoginPage
│   └── admin/          # AdminPage, PostFormPage
├── types/index.ts      # PostSummary, PostDetail, Tag, Comment, PagedResponse, CreatePostRequest
└── utils/date.ts       # formatDate()
```

## API Endpoints

| Method | URL | Auth | Mô tả |
|--------|-----|------|-------|
| POST | /api/auth/login | No | Đăng nhập |
| GET | /api/posts | No | Danh sách (page, pageSize, tag) |
| GET | /api/posts/search?q= | No | Tìm kiếm |
| GET | /api/posts/{slug} | No | Chi tiết bài |
| POST | /api/posts | Yes | Tạo bài |
| PUT | /api/posts/{id} | Yes | Sửa bài |
| DELETE | /api/posts/{id} | Yes | Xóa bài |
| GET | /api/tags | No | Danh sách tag |
| POST | /api/tags | Yes | Tạo tag |
| DELETE | /api/tags/{id} | Yes | Xóa tag |
| GET | /api/posts/{postId}/comments | No | Lấy bình luận |
| POST | /api/posts/{postId}/comments | No | Thêm bình luận |

## Response format (mọi API đều dùng)
```json
{ "success": true, "data": {}, "message": "..." }
{ "success": false, "message": "Lỗi...", "errors": ["..."] }
```

## DB Schema
- **Users**: Id, Username (unique), PasswordHash, CreatedAt
- **Posts**: Id, Title, Content, Thumbnail, Slug (unique), CreatedAt, UpdatedAt
- **Tags**: Id, Name (unique), Slug (unique)
- **PostTags**: PostId + TagId (composite PK, many-to-many)
- **Comments**: Id, PostId (FK), AuthorName, Content, CreatedAt

## Nguyên tắc kiến trúc (SOLID)
- **Controllers** chỉ nhận request và trả response — không có business logic
- **Services** xử lý business logic — phụ thuộc vào Repository interface
- **Repositories** chỉ truy vấn DB — không có business logic
- **Mọi lỗi** throw Exception → bắt tại ErrorHandlingMiddleware → trả ApiResponse
- **DI** hoàn toàn qua interface, đăng ký trong ServiceExtensions

## Trạng thái hiện tại (cập nhật 2026-04-24)
### Đã hoàn thành
- [x] Backend: CRUD Posts, Tags, Comments, Auth JWT
- [x] Backend: FluentValidation, Serilog, ErrorHandling Middleware
- [x] Backend: EF Core Fluent API configurations
- [x] Frontend: React + TypeScript + Tailwind
- [x] Frontend: AuthContext, ErrorBoundary, LoadingSpinner
- [x] Frontend: Trang Home, PostDetail, Search, Login, Admin, PostForm
- [x] Frontend: Redesign HomePage theo theme "The Blogger" (3 cột: featured | 2 stacked | sidebar)
- [x] Frontend: PostFormPage — chọn ảnh bìa từ local (base64, không dùng URL)
- [x] Git: Khởi tạo repo, push lên GitHub (https://github.com/DangVanOanh/FirstBlogProjectAI)

### Việc cần làm tiếp theo (theo thứ tự ưu tiên)
- [ ] Unit test Backend (xUnit + Moq)
- [ ] Rich text editor (TipTap)
- [ ] Upload ảnh thực (Cloudinary) — thay thế base64 hiện tại
- [ ] SEO (React Helmet)
- [ ] Rate limiting API
- [ ] CORS production config
- [ ] Docker + docker-compose
- [ ] CI/CD GitHub Actions
