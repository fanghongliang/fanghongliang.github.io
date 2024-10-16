import java.io.*;


public class Emp {
  String name;
  int age = 20;
  String desc;
  double salary;

  // 显式声明构造函数 
  public Emp(String name) {
    this.name = name;
  }

  // 设置年龄
  public void empAge(int age) {
    this.age = age;
  }

  // 设置薪水
  public void empSalary(double salary) {
    this.salary = salary;
  }

  public void printEmpInfo() {
    System.out.println("名字： " + name);
    System.out.println("年龄： " + age);
    System.out.println("薪水： " + salary);
  }
} 