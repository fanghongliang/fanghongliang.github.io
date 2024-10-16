import java.io.*;


public class Hero {
  String name;
  int attDamage;  //
  int abilityPower;
  int armor;
  int magicResistance;
  float attackSpeed;
  int moveSpeed;
  int hp;
  int mp;

  public void DestroyTower () {
    System.out.println("正在拆塔");
  }

  public void Keng () {
    System.out.println("坑了一个队友");
  }

  public void KillOne() {
    System.out.println("抢了一个头");
  }

  public void Dance () {
    System.out.println("跳舞嘲讽");
  }
}
