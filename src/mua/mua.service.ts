import { MuaDto } from './dto/mua.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MuaService {
  constructor(private prisma: PrismaService) {}
  async getAllmua() {
    const mua = await this.prisma.mua.findMany();
    let res = [];
    for await (const m of mua) {
      const kh = await this.prisma.khachHang.findUnique({
        where: {
          id: m.maKH,
        },
      });
      const bh = await this.prisma.baiHat.findUnique({
        where: {
          id: m.maBH,
        },
      });

      res.push({
        id: m.id,
        ngay: m.ngay,
        gia: m.gia,
        maKH: kh.taiKhoan,
        maBH: bh.tenBH,
        thang: m.thang,
        nam: m.nam,
      });
    }
    return res;
  }
  async getmuaById(id: string) {
    const m = await this.prisma.mua.findUnique({
      where: {
        id: id,
      },
    });
    const kh = await this.prisma.khachHang.findUnique({
      where: {
        id: m.maKH,
      },
    });
    const bh = await this.prisma.baiHat.findUnique({
      where: {
        id: m.maBH,
      },
    });
    return {
      id: m.id,
      ngay: m.ngay,
      gia: m.gia,
      maKH: kh.taiKhoan,
      maBH: bh.tenBH,
      thang: m.thang,
      nam: m.nam,
    };
  }

  async addmua(bai: MuaDto) {
    const baihat = await this.prisma.baiHat.findUnique({
      where: {
        id: bai.maBH,
      },
    });
    await this.prisma.baiHat.update({
      where: {
        id: bai.maBH,
      },
      data: {
        luotMua: baihat.luotMua + 1,
      },
    });
    const khachhang = await this.prisma.khachHang.findUnique({
      where: {
        id: bai.maKH,
      },
    });
    await this.prisma.khachHang.update({
      where: {
        id: bai.maKH,
      },
      data: {
        doanhThu: khachhang.doanhThu + baihat.gia,
      },
    });
    const mua = await this.prisma.mua.create({
      data: {
        ...bai,
        thang: new Date().getMonth(),
        nam: new Date().getFullYear(),
        gia: baihat.gia,
      },
    });
    const casi = await this.prisma.casi.findUnique({
      where: {
        id: baihat.maCS,
      },
    });
    const hang = await this.prisma.hang.findUnique({
      where: {
        id: casi.maHang,
      },
    });

    ///chua co cot tien mua
    const tienluongcasi = await this.prisma.tienLuongCaSi.findFirst({
      where: {
        maCS: baihat.maCS,
        thangGhiNhan: mua.thang,
        namGhiNhan: mua.nam,
      },
    });
    if (!tienluongcasi) {
      await this.prisma.tienLuongCaSi.create({
        data: {
          maCS: baihat.maCS,
          thangGhiNhan: mua.thang,
          namGhiNhan: mua.nam,
          tienShow: 0,
          tienBaiHat: baihat.gia,
          luong: casi.luongCB + baihat.gia * (hang.chietKhau / 100),
          ghiChu: '',
        },
      });
    } else {
      await this.prisma.tienLuongCaSi.update({
        where: {
          id: tienluongcasi.id,
        },
        data: {
          tienBaiHat: tienluongcasi.tienBaiHat + baihat.gia,
          luong:
            casi.luongCB +
            (tienluongcasi.tienBaiHat + baihat.gia + tienluongcasi.tienShow) *
              (hang.chietKhau / 100),
        },
      });
    }
    return mua;
  }
  async updatemua(bai: MuaDto, id: string) {
    const gia = await this.prisma.baiHat.findUnique({
      where: {
        id: bai.maBH,
      },
    });
    return await this.prisma.mua.update({
      data: {
        ...bai,
        gia: gia.gia,
      },
      where: {
        id: id,
      },
    });
  }
  async deletemua(id: string) {
    return await this.prisma.mua.delete({
      where: {
        id: id,
      },
    });
  }
}
