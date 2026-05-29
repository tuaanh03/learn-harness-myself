# Ket qua trao doi cold start audit - Project 02

## Pham vi

- Workspace: `projects/project-02/starter`
- Noi dung duoc tong hop tu trao doi va cac file trong workspace: `docs/ARCHITECTURE.md`, `feature_list.json`, `package.json`, `AGENTS.md`.
- Phien nay moi ghi nhan thong tin ban dau; chua sua ma nguon, chua chay kiem tra build/test va chua khoi dong ung dung.

## He thong la gi va phuc vu nguoi dung nhu the nao?

He thong la ung dung desktop **Knowledge Base** duoc xay dung voi Electron, React va TypeScript. Ung dung huong toi viec giup nguoi dung quan ly tai lieu ca nhan va hoi dap dua tren noi dung tai lieu.

Luong nguoi dung du kien:

1. Nhap tai lieu dinh dang `.txt` hoac `.md`.
2. Luu tai lieu cuc bo trong vung du lieu cua ung dung.
3. Chia noi dung thanh cac doan nho de lap chi muc.
4. Nhan cau hoi tu nguoi dung.
5. Tim cac doan lien quan va tao cau tra loi kem citation nguon.

## Codebase duoc to chuc nhu the nao?

| Layer / Module | Vi tri | Trach nhiem |
| --- | --- | --- |
| Main process | `src/main/` | Quan ly vong doi Electron, tao cua so, khoi tao service va dang ky IPC handler. |
| Preload bridge | `src/preload/` | Expose API gioi han cho renderer bang `contextBridge`; chuyen loi goi UI sang IPC. |
| Renderer | `src/renderer/` | Giao dien React cho danh sach tai lieu, chi tiet, import, hoi dap va trang thai. |
| Services | `src/services/` | Nghiep vu luu tru, quan ly tai lieu, indexing va hoi dap. |
| Shared types | `src/shared/types.ts` | Kieu du lieu va ten IPC channel dung chung giua cac layer. |

Service chinh:

- `PersistenceService`: doc/ghi du lieu cuc bo.
- `DocumentService`: nhap, liet ke, xem, cap nhat va xoa tai lieu.
- `IndexingService`: chunking va quan ly index.
- `QaService`: truy xuat cac chunk lien quan va tao cau tra loi co citation.

Ranh gioi kien truc can giu:

- Renderer khong truy cap truc tiep `fs`, `path`, `electron` hoac module Node.js.
- Preload bridge la kenh giao tiep giua renderer va main process.
- Services khong phu thuoc vao renderer.
- IPC channels duoc tap trung trong `src/shared/types.ts`.
- Du an dung TypeScript strict mode; khong dung `any` neu khong co giai thich.

## Lam the nao de chay he thong?

Tu thu muc workspace hien tai:

```powershell
npm install
npm run check
npm run dev
```

Lenh bo sung:

```powershell
npm run build
npm test
```

## Lam the nao de xac minh mot thay doi la dung?

Quy trinh xac minh duoc de xuat:

1. Chay `npm run check` de kiem tra TypeScript cho cac phan cua ung dung.
2. Chay `npm test` neu thay doi lien quan den logic co the kiem thu tu dong.
3. Chay `npm run build` de phat hien loi tich hop hoac bundling.
4. Chay `npm run dev` va kiem thu thu cong luong nguoi dung bi anh huong.
5. Kiem tra rang thay doi van ton trong cac ranh gioi kien truc neu tren.

Vi du xac minh thu cong:

- Document import: nhap file `.txt` hoac `.md`, xac nhan tai lieu xuat hien va noi dung dung.
- Persistence: nhap tai lieu, dong/mo lai ung dung, xac nhan tai lieu van con.
- IPC/preload: thao tac tu UI thanh cong va khong co loi runtime.

## Trang thai cong viec duoc ghi nhan

Theo `feature_list.json`, cac tinh nang da duoc ghi nhan `pass`:

| Tinh nang | Ket qua ghi nhan |
| --- | --- |
| `window-launch` | Mo cua so Electron voi cau hinh preload phu hop. |
| `document-list` | Sidebar hien thi danh sach tai lieu va trang thai rong. |
| `question-panel` | Thanh nhap cau hoi gui yeu cau qua IPC. |
| `data-directory` | `PersistenceService` quan ly thu muc du lieu ung dung. |

Nhung tinh nang chua bat dau hoac chua co bang chung xac minh:

| Tinh nang | Muc tieu |
| --- | --- |
| `document-import` | Nhap file `.txt` va `.md` tu `ImportPanel`. |
| `document-detail` | Hien thi noi dung day du, metadata va nut xoa tai lieu. |
| `basic-persistence` | Tai lieu da nhap van ton tai sau khi khoi dong lai ung dung. |

Luu y: day la trang thai repository cong bo, khong phai ket qua xac minh doc lap cua phien nay.

## Diem bat dau de xuat cho phien tiep theo

1. Thiet lap baseline bang `npm install` va `npm run check`.
2. Khao sat luong `DocumentService` qua IPC/preload den `ImportPanel` va `DocumentDetail`.
3. Hoan thien va xac minh `document-import`.
4. Trien khai hoac kiem tra `document-detail`.
5. Kiem thu `basic-persistence` bang viec nhap tai lieu, khoi dong lai ung dung va xac nhan du lieu con ton tai.
