﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using Model;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace hhfe.Migrations
{
    [DbContext(typeof(DustContext))]
    [Migration("20181017192718_Initial")]
    partial class Initial
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.SerialColumn)
                .HasAnnotation("ProductVersion", "2.1.4-rtm-31024")
                .HasAnnotation("Relational:MaxIdentifierLength", 63);

            modelBuilder.Entity("Model.DataEnhancement", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Pressure");

                    b.Property<int>("SensorDataId");

                    b.Property<double?>("WindDirection");

                    b.Property<double>("WindSpeed");

                    b.HasKey("Id");

                    b.HasIndex("SensorDataId")
                        .IsUnique();

                    b.ToTable("DataEnhancements");
                });

            modelBuilder.Entity("Model.Sensor", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("Altitude");

                    b.Property<double>("Latitude");

                    b.Property<double>("Longitude");

                    b.Property<string>("Name")
                        .IsRequired();

                    b.Property<string>("NodeId");

                    b.HasKey("Id");

                    b.HasIndex("NodeId")
                        .IsUnique();

                    b.ToTable("Sensors");
                });

            modelBuilder.Entity("Model.SensorData", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<double>("AirTemperature");

                    b.Property<int?>("DataEnhancemetId");

                    b.Property<double>("ParticulateMatter100");

                    b.Property<double>("ParticulateMatter25");

                    b.Property<double>("RelativeHumidity");

                    b.Property<int>("SensorId");

                    b.Property<DateTimeOffset>("Timestamp");

                    b.HasKey("Id");

                    b.HasIndex("SensorId");

                    b.ToTable("SensorDatas");
                });

            modelBuilder.Entity("Model.DataEnhancement", b =>
                {
                    b.HasOne("Model.SensorData", "SensorData")
                        .WithOne("DataEnhancement")
                        .HasForeignKey("Model.DataEnhancement", "SensorDataId")
                        .OnDelete(DeleteBehavior.Restrict);
                });

            modelBuilder.Entity("Model.SensorData", b =>
                {
                    b.HasOne("Model.Sensor", "Sensor")
                        .WithMany("SensorDatas")
                        .HasForeignKey("SensorId")
                        .OnDelete(DeleteBehavior.Restrict);
                });
#pragma warning restore 612, 618
        }
    }
}
