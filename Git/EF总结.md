# Entity Framework的三种开发风格

    * Database First:这是一种用于已存在数据库模式的方法。使用这种方法，EDM是从数据库模式中生成的，这种方法最适合于使用了已经存在的数据库的应用。
    * Code First:这种方法中，所有的领域模型都是以类的形式编写的。这些类会建立我们的EDM，数据库模式会从这些类中创建。这种方法最适合于那些高度以领域为中心并且领域模型类创建优先的应用程序。这里需要的数据库只是为了这些领域模型的持久化机制。
    * Model First:这种方法和Code First方法很相似，但是这种情况下我们使用了EDM视觉设计器来设计我们的模型。数据库模式和类将会通过这个概念模型生成。该模型将会给我们创建数据库的SQL语句，然后我们可以使用它来创建数据库并连接应用程序。

<font color="#dfafaf" size=6>Code First风格开发</font>

---

### 1 新建实体类，实体类对应数据库中的表 他的属性对应表中的列

    public class Donator
    {
        public int DonatorId { get; set; }
        public string Name { get; set; }
        public decimal Amount { get; set; }
        public DateTime DonateDate { get; set; }
    }

### 2 创建数据库上下文

    class Context:DbContext
    {
        //连接数据库
        public Context()
            : base("name=EFTest")
        {
        }

        //对应数据表
        public DbSet<Donator> Donators { get; set; }
        public DbSet<PayWay> PayWays { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)//配置领域类到数据库模式的映射
        {
            //modelBuilder.Entity<Donator>().ToTable("Donators").HasKey(m => m.DonatorId);//映射到表Donators,DonatorId当作主键对待  modelBuilder.Entity<Donator>()会得到EntityTypeConfiguration类的一个实例
            //modelBuilder.Entity<Donator>().Property(m => m.DonatorId).HasColumnName("Id");//映射到数据表中的主键名为Id而不是DonatorId
            //modelBuilder.Entity<Donator>().Property(m => m.Name)
            //    .IsRequired()//设置Name是必须的，即不为null,默认是可为null的
            //    .IsUnicode()//设置Name列为Unicode字符，实际上默认就是unicode,所以该方法可不写
            //    .HasMaxLength(10);//最大长度为10

            //base.OnModelCreating(modelBuilder);

            modelBuilder.Configurations.Add(new DonatorMap());
            base.OnModelCreating(modelBuilder);
        }
    }

### 3 编写配置文件 name为你想要创建的数据库的名字

     <!--Start:不要放在前面，否则回报错  CodeFirstApp为数据库名 没有就创建-->
     <connectionStrings>
         <add name="EFTest" connectionString="Server=.;Database=CodeFirstApp;uid=sa;pwd=123"     providerName="System.Data.SqlClient" />
        <!-- <add name="Entities" connectionString="metadata=res://*/Model1.csdl|res://*/Model1.ssdl|res://*/Model1.msl;provider=Oracle.DataAccess.Client;provider connection string=&quot;data source=FMP;password=FMPPASS;persist security info=True;user id=FMP&quot;" providerName="System.Data.EntityClient" /> -->
    </connectionStrings>
    <!--End-->

using (var context = new Context())
｛

### 4 创建数据库

    context.Database.CreateIfNotExists();//如果数据库不存在时则创建

### 5 数据库操作

    a 添加数据

            var donators = new List<Donator>
                  {
                      new Donator
                      {
                        Name   = "陈志康",
                        Amount = 50,
                        DonateDate = new DateTime(2016, 4, 7)
                      },
                      new Donator
                      {
                          Name = "海风",
                          Amount = 5,
                          DonateDate = new DateTime(2016, 4, 8)
                      },
                      new Donator
                      {
                          Name = "醉千秋",
                          Amount = 18.8m,
                          DonateDate = new DateTime(2016, 4, 15)
                      }
                  };

                  context.Donators.AddRange(donators);
                  context.SaveChanges();

    b 查询数据

            var donators = context.Donators;
            foreach (var donator in donators)
            {
                ...
            }

    c 更新数据

        var donators = context.Donators;
        if (donators.Any())
        {
            var toBeUpdatedDonator = donators.First(d => d.Name == "醉千秋");
            toBeUpdatedDonator.Name = "醉、千秋";
            context.SaveChanges();
        }

    d 删除数据

        var toBeDeletedDonator = context.Donators.Single(d => d.Name == "待打赏");//根据Name找到要删除的测试数据
        if (toBeDeletedDonator != null)
        {
            context.Donators.Remove(toBeDeletedDonator);//如果满足条件，就将该对象使用Remove方法标记为Deleted
            context.SaveChanges();//最后持久化到数据库
        }

｝

### 6 数据库模型发生改变 （如果你修改了Donator类或者又添加了新的DbSet属性（即添加了新表），在操作的过程中你可能会遇到一些异常） 这就需要用到初始化器了

    a 创建初始化器
        
        //namespace FirstCodeFirstApp
        //{
          public class Initializer:DropCreateDatabaseIfModelChanges<Context>
          {

          }
         //}

    b 使用初始化器

        static void Main(string[] args)
        {
            Database.SetInitializer(new Initializer());//放第一行
            //more code
        }

    c DropCreateDatabaseIfModelChanges会销毁之前的数据库，因此之前累积的所有数据也都丢失了 初始化器允许创建之后运行指定代码

       public class Initializer:DropCreateDatabaseIfModelChanges<Context>
        {
            //该代码为表PayWay新增了三条数据
            protected override void Seed(Context context)
             {
                context.PayWays.AddRange(new List<PayWay>
                 {
                     new PayWay{Name = "支付宝"},
                    new PayWay{Name = "微信"},
                    new PayWay{Name = "QQ红包"}
                 });
            }
        }

    * EF关心三种初始化器

        CreateDatabaseIfNotExists<TContext>指如果数据库不存在则创建，   DropCreateDatabaseIfModelChanges<TContext>指如果模型改变了（包括模型类的更改以及上下文中集合属性的 添加和移除）就销毁之前的数据库再创建数据库
        DropCreateDatabaseAlways<TContext>总是销毁再重新创建数据库，如果没有指定的话默认使用第一个初始化器

    error:如果报错可能是因为数据库被打开了 关闭所有的连接即可

---

### 7 配置数据库结构（表间关系、表中字段名称等等）

    三种方法

    * 特性，也叫数据注解
    * DbModelBuilder API
    * 配置伙伴类


        a 特性
    
            [Table("Donator")] //指定该类要映射到数据库中的表名
            public class Donator
            {
                [Key] //指定主键
                [Column("Id")]//指定要映射表中列名 用Id而不用DonatoId
                public int DonatorId { get; set; }
                [StringLength(10,MinimumLength = 2)]
                public string Name { get; set; }
                public decimal Amount { get; set; }
                public DateTime DonateDate { get; set; }
            }

            [Table("PayWay")]
            public class PayWay
            {
                public int Id { get; set; }
                [MaxLength(8,ErrorMessage = "支付方式的名称长度不能大于8")]
                public string Name { get; set; }
            }

        b DbModelBuilder API

            public class Donator
            {
                public int DonatorId { get; set; }
                public string Name { get; set; }
                public decimal Amount { get; set; }
                public DateTime DonateDate { get; set; }
            }

            在数据库上下文Context中重写DbContext中的OnModelCreating方法
            namespace FirstCodeFirstApp
            {
                public class Context:DbContext
                {
                    public Context()
                        : base("name=FirstCodeFirstApp")
                    {
                    }

                    public DbSet<Donator> Donators { get; set; }
                    public DbSet<PayWay> PayWays { get; set; }

                    protected override void OnModelCreating(DbModelBuilder modelBuilder)
                    {
                        modelBuilder.Entity<Donator>().ToTable("Donators").HasKey(m => m.DonatorId);//映射到表Donators,DonatorId当作主键对待
                        modelBuilder.Entity<Donator>().Property(m => m.DonatorId).HasColumnName("Id");//映射到数据表中的主键名为Id而不是DonatorId
                        modelBuilder.Entity<Donator>().Property(m => m.Name)
                            .IsRequired()//设置Name是必须的，即不为null,默认是可为null的
                            .IsUnicode()//设置Name列为Unicode字符，实际上默认就是unicode,所以该方法可不写
                            .HasMaxLength(10);//最大长度为10

                     base.OnModelCreating(modelBuilder);
                    }
                }
            }

        c 为每个实体类配置一个伙伴类

            public class DonatorMap:EntityTypeConfiguration<Donator>
            {
                public DonatorMap()
                {
                    ToTable("Donators");
                    Property(m => m.Name)
                     .IsRequired()//将Name设置为必须的
                     .HasColumnName("Name");
                }
            }

            b中OnModelCreating方法中编辑如下代码即可
            protected override void OnModelCreating(DbModelBuilder modelBuilder)
            {
            modelBuilder.Configurations.Add(new DonatorMap());
            base.OnModelCreating(modelBuilder);
            }

### 管理实体间关系

        a 一对多

            设两个关联表a和b 在a的实体类中添加类型为b的集合 属性
            //两个实体类 一个捐助者有多种捐助方式
            public class Donator
            {
                public int Id { get; set; }
                public string Name { get; set; }
                public decimal Amount { get; set; }
                public DateTime DonateDate { get; set; }
                public virtual ICollection <PayWay> PayWays { get; set; }
            }
            class PayWay
            {
                public int Id { get; set; }
                public string Name { get; set; }
            }
            为了避免潜在的null引用异常可能性，当Donator对象创建时，我们使用HashSet的T集合类型实例创建一个新的集合实例，如下所示：
            public Donator()
            {
                PayWays=new HashSet<PayWay>();
            }

            当我们为实体类Donator创建实例时 payway表中会自动添加外键列与主表关联
            var donator = new Donator
            {
                Amount = 6,
                Name = "键盘里的鼠标",
                DonateDate =DateTime.Parse("2016-4-13"),
            };
            donator.PayWays.Add(new PayWay{Name = "支付宝"});
            donator.PayWays.Add(new PayWay{Name = "微信"});
            context.Donators.Add(donator);
            context.SaveChanges();

            不想用自动添加的外键列名 可在伙伴类中追加下面的代码自定义命名
            HasMany(d => d.PayWays)
            .WithRequired()
            .HasForeignKey(p => p.DonatorId);

            另一种情况
            //两个实体类 每种捐赠者类型中可包含多个捐赠者
            public class Donator
            {
                public Donator()
                {
                    PayWays=new HashSet<PayWay>();
                }

                public int Id { get; set; }
                public string Name { get; set; }
                public decimal Amount { get; set; }
                public DateTime DonateDate { get; set; }
                public virtual ICollection<PayWay> PayWays { get; set; }

                public int? DonatorTypeId { get; set; }
                public virtual DonatorType DonatorType { get; set; }
            }
            public class DonatorType
            {
               public int Id { set; get; }
               public string Name { set; get; }

               public virtual ICollection<Donator> Donators { get; set; }
            }

            //伙伴类配置两实体类间关系
            public class DonatorTypeMap:EntityTypeConfiguration<DonatorType>
            {
               public DonatorTypeMap()
               {
                   HasMany(dt=>dt.Donators)
                       .WithOptional(d=>d.DonatorType)
                       .HasForeignKey(d=>d.DonatorTypeId)
                       .WillCascadeOnDelete(false);
              }
            }
            protected override void OnModelCreating(DbModelBuilder modelBuilder)
            {

                modelBuilder.Configurations.Add(new DonatorMap());
                modelBuilder.Configurations.Add(new DonatorTypeMap());

                //与.WillCascadeOnDelete(false);等价
                modelBuilder.Conventions.Remove<OneToManyCascadeDeleteConvention>();
                modelBuilder.Conventions.Remove<ManyToManyCascadeDeleteConvention>();

                base.OnModelCreating(modelBuilder);
            }
    
        b 一对一

            public class Person
            {
                public int PersonId { get; set; }
                public string Name { get; set; }
                public bool IsActive { get; set; }
                public virtual Student Student { get; set; }
            }
            public class Student
            {
                public int PersonId { get; set; }
                public virtual Person Person { get; set; }
                public string CollegeName { get; set; }
                public DateTime EnrollmentDate { get; set; }
            }

            public class StudentMap:EntityTypeConfiguration<Student>
            {
                public StudentMap()
                {
                    HasRequired(s=>s.Person)
                    .WithOptional(p=>p.Student);
                    HasKey(s => s.PersonId);
                    Property(s => s.CollegeName)
                    .HasMaxLength(50)
                    .IsRequired();
                }
            }

            在数据库上下文中添加DbSet的属性和在OnModelCreating方法中添加PersonMap的配置引用

            var student = new Student
            {
                CollegeName = "XX大学",
                EnrollmentDate = DateTime.Parse("2011-11-11"),
                Person = new Person
                {
                    Name = "Farb",
                }
            };

            context.Students.Add(student);
            context.SaveChanges();

        c 多对多

            public class Company
            {
                public Company()
                {
                    Persons = new HashSet<Person>();
                }
                public int CompanyId { get; set; }
                public string CompanyName { get; set; }
                public virtual ICollection <Person> Persons { get; set; }
            }

            public class Person
            {
                public Person()
                {
                    Companies=new HashSet<Company>();
                }
                public int PersonId { get; set; }
            public string Name { get; set; }
                public bool IsActive { get; set; }
                public virtual Student Student { get; set; }
                public virtual ICollection<Company> Companies { get; set; }
            }

            public class PersonMap:EntityTypeConfiguration<Person>
            {
                public PersonMap()
                {
                    HasMany(p => p.Companies)
                        .WithMany(c => c.Persons)
                        .Map(m =>
                        {
                            m.MapLeftKey("PersonId");
                            m.MapRightKey("CompanyId");
                        });
                }
            }

            在数据库上下文中添加DbSet的属性和在OnModelCreating方法中添加PersonMap的配置引用

            var person = new Person
            {
                Name = "比尔盖茨",
            };
            var person2 = new Person
            {
                Name = "乔布斯",
            };
            context.People.Add(person);
            context.People.Add(person2);
            var company = new Company
            {
                CompanyName = "微软"
            };
            company.Persons.Add(person);
            context.Companies.Add(company);
            context.SaveChanges();
