# Exercise 1 Result Format

Muc tieu: do "rebuild cost" khi agent bat dau phien moi khong co handoff, sau do so sanh voi truong hop co `session-handoff.md`.

## Cau truc ket qua

```text
exercise_1/
  README.md
  comparison.md
  no_handoff/
    rebuild-cost-log.md
  handoff_exist/
    session-handoff.md
    rebuild-cost-log.md
```

## Cach dung

1. Chon 3 feature tuong duong 3 phien lam viec.
2. Chay lan 1 trong `no_handoff`: khong tao handoff sau moi phien, chi ghi lai chi phi khoi phuc trang thai o dau phien sau.
3. Chay lan 2 trong `handoff_exist`: sau moi phien cap nhat `session-handoff.md`, dau phien sau do thoi gian doc handoff va san sang tiep tuc.
4. Dien ket qua tong hop vao `comparison.md`.

## Don vi do

- Uu tien do bang phut, vi du `8 min`.
- Neu chi mo phong nhanh, co the do bang so luong file agent phai doc lai va so diem mo ho gap phai.

## Feature goi y

| Session | Feature | Ket qua can co |
|---|---|---|
| 1 | metadata-extraction | Document co metadata khi import |
| 2 | document-chunking / indexing-status-ui | Document duoc chunk va status hien tien do |
| 3 | grounded-qa | Cau tra loi co citation, excerpt, confidence |
