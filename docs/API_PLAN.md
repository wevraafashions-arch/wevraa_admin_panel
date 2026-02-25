# API Integration Plan

This document describes how API calls are structured and how to add new endpoints.

## Base URL & config

- **Config:** `src/app/api/config.ts`
- **Base URL:** Set `VITE_API_BASE_URL` in `.env` (see `.env.example`). Default points to the provided backend.
- **Prefix:** All requests use `${API_BASE_URL}/api/v1`.

## Auth & tokens

- **Login:** `POST /auth/login` — body: `{ email, password }`. Response: `{ accessToken, refreshToken, expiresIn, user }`.
- **Refresh:** `POST /auth/refresh` — body: `{ refreshToken }`. Response: same shape as login.
- **Storage:** Tokens and user are stored in **cookies** via `js-cookie`:
  - `wevraa_access_token`, `wevraa_refresh_token`, `wevraa_user`
  - Keys and helpers: `src/app/api/cookies.ts`

## API client

- **File:** `src/app/api/client.ts`
- **Usage:** `apiClient<T>(path, options)` — path is relative to `/api/v1` (e.g. `/auth/login`, `/categories`).
- **Behavior:**
  - Sends `Content-Type: application/json` and `Authorization: Bearer <accessToken>` when not `skipAuth`.
  - On **401**, calls refresh endpoint, stores new tokens, retries the request once (unless `skipRefresh: true`).
- **Errors:** Throws `ApiError` with `message`, `status`, and optional `body`.

## Services

- **Auth:** `src/app/api/services/authService.ts` — `login()`, `refresh()`.
- **Categories:** `src/app/api/services/categoriesService.ts` — `getList()`, `getById()`, `create()`, `update()`, `delete()`.

## Types

- **Auth:** `src/app/api/types/auth.ts` — `ApiUser`, `LoginRequest`, `AuthTokensResponse`, `RefreshRequest`.
- **Category:** `src/app/api/types/category.ts` — `Category`, `CreateCategoryRequest`, `UpdateCategoryRequest`.

## Adding a new resource (e.g. products)

1. **Types:** Add `src/app/api/types/product.ts` (request/response interfaces).
2. **Service:** Add `src/app/api/services/productsService.ts`:
   - Use `apiClient<T>(path, options)` for each endpoint.
   - Paths relative to base: `/products`, `/products/:id`.
3. **Pages:** In components, call the service and handle loading/error state (e.g. with `useState`/`useEffect` or a data-fetching library).

## Categories API reference (implemented)

| Method | Path               | Body                    | Response              |
|--------|--------------------|-------------------------|------------------------|
| GET    | `/categories`      | —                       | `Category[]`           |
| GET    | `/categories/:id`  | —                       | `Category`             |
| POST   | `/categories`      | CreateCategoryRequest   | `Category`             |
| PATCH  | `/categories/:id`  | UpdateCategoryRequest   | `Category`             |
| DELETE | `/categories/:id`  | —                       | —                      |

## GST Rates API reference (frontend integrated)

| Method | Path                 | Body                     | Response     |
|--------|----------------------|--------------------------|--------------|
| GET    | `/gst-rates`         | —                        | `GSTRate[]` (each with `hsnCodes` and `_count.hsnCodes`) |
| GET    | `/gst-rates/:id`     | —                        | `GSTRate` (full `hsnCodes` list) |
| POST   | `/gst-rates`         | `CreateGSTRateRequest`   | `GSTRate`    |
| PATCH  | `/gst-rates/:id`     | `UpdateGSTRateRequest`   | `GSTRate`    |
| DELETE | `/gst-rates/:id`     | —                        | —            |

- **Types:** `src/app/api/types/gstRate.ts`
- **Service:** `src/app/api/services/gstRatesService.ts`
- **POST body:** `{ name, percentage, isDefault?, hsnCodes?: [{ code, description }] }`
- **PATCH body:** Same shape; all fields optional. If `hsnCodes` is sent, it replaces all HSN codes for that rate.

## Designs API reference (frontend integrated)

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/designs` | — | `Design[]` |
| GET | `/designs?categoryId=&subcategoryId=` | — | `Design[]` (filtered) |
| GET | `/designs/:id` | — | `Design` |
| POST | `/designs/with-image` | multipart: `image` (file), `designName`, `description`, `categoryId`, `subcategoryId` | `Design` |
| POST | `/designs` | JSON: `CreateDesignRequest` (designName, description, categoryId, subcategoryId, imageUrl) | `Design` |
| PATCH | `/designs/:id/with-image` | multipart: `image` (optional), `designName`, `description`, `categoryId`, `subcategoryId` | `Design` |
| PATCH | `/designs/:id` | JSON: `UpdateDesignRequest` (all optional) | `Design` |
| DELETE | `/designs/:id` | — | — |

- **Types:** `src/app/api/types/design.ts`
- **Service:** `src/app/api/services/designsService.ts`
- **Image:** JPG/PNG/GIF, max 10MB.

## Gallery (My Gallery) API reference (frontend integrated)

| Method | Path | Body | Response |
|--------|------|------|----------|
| GET | `/gallery` | — | `GalleryImage[]` |
| GET | `/gallery?categoryId=&subcategoryId=&isPublic=` | — | `GalleryImage[]` (filtered) |
| GET | `/gallery/:id` | — | `GalleryImage` |
| POST | `/gallery/with-image` | multipart: `image`, `title`, `description`, `categoryId`, `subcategoryId`, `tags` (comma-separated), `isPublic` | `GalleryImage` |
| POST | `/gallery` | JSON: `imageUrl`, `title`, `description`, `categoryId`, `subcategoryId`, `tags` (array), `isPublic` | `GalleryImage` |
| PATCH | `/gallery/:id/with-image` | multipart: `image` (optional), `title`, `description`, `categoryId`, `subcategoryId`, `tags`, `isPublic` | `GalleryImage` |
| PATCH | `/gallery/:id` | JSON: partial update | `GalleryImage` |
| DELETE | `/gallery/:id` | — | — |

- **Types:** `src/app/api/types/gallery.ts`
- **Service:** `src/app/api/services/galleryService.ts`
- **Categories:** Use `GET /tailor-categories` (top-level) and `GET /tailor-categories?parentId=<id>` (subcategories).

## Checklist for new endpoints

- [ ] Add types in `src/app/api/types/` if needed.
- [ ] Add or extend service in `src/app/api/services/`.
- [ ] Use `apiClient` so auth and refresh are applied automatically.
- [ ] Handle `ApiError` in the UI (message, status).
