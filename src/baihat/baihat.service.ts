import { BaiHatDto } from './dto/baihat.dto';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BaihatService {
  constructor(private prisma: PrismaService) {}
  async getAllBaiHat() {
    const res = [];
    const baihat = await this.prisma.baiHat.findMany();
    for await (const bh of baihat) {
      const casi = await this.prisma.casi.findUnique({
        where: {
          id: bh.maCS,
        },
      });
      res.push({
        maBH: bh.id,
        tenBH: bh.tenBH,
        ngayPhatHanh: bh.ngayPhatHanh,
        hinhAnh: bh.hinhAnh,
        mp4: bh.mp4,
        luotView: bh.luotView,
        luotMua: bh.luotMua,
        gia: bh.gia,
        maCS: casi.hoTen,
      });
    }
    return res;
  }
  async getBaiHatById(id: string) {
    const bh = await this.prisma.baiHat.findUnique({
      where: {
        id: id,
      },
    });

    const casi = await this.prisma.casi.findUnique({
      where: {
        id: bh.maCS,
      },
    });

    return {
      maBH: bh.id,
      tenBH: bh.tenBH,
      ngayPhatHanh: bh.ngayPhatHanh,
      hinhAnh: bh.hinhAnh,
      mp4: bh.mp4,
      luotView: bh.luotView,
      luotMua: bh.luotMua,
      gia: bh.gia,
      maCS: casi.hoTen,
      macs: bh.maCS,
    };
  }

  async addBaiHat(bai: BaiHatDto, gia: number) {
    return await this.prisma.baiHat.create({
      data: {
        ...bai,
        luotMua: 0,
        luotView: 0,
        gia: gia,
      },
    });
  }
  async updateBaiHat(bai: BaiHatDto, doanhthu: number, id: string) {
    return await this.prisma.baiHat.update({
      data: {
        ...bai,
        gia: doanhthu,
      },
      where: {
        id: id,
      },
    });
  }
  async deleteBaiHat(id: string) {
    return await this.prisma.baiHat.delete({
      where: {
        id: id,
      },
    });
  }
}
