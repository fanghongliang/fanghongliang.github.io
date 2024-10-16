import java.io.*;

public class EmpTest {
  public static void main(String[] args) {
    Emp empone = new Emp("章三");
    Emp emptwo = new Emp("李四");


    //
    // empone.empAge(18);
    empone.empSalary(3600);
    empone.printEmpInfo();

    emptwo.empAge(39);
    emptwo.empSalary(43600);
    emptwo.printEmpInfo();
  }
}