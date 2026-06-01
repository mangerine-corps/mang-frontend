import {
  Box,
  Button,
  HStack,
  Input,
  InputGroup,
  Tag,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { HiMiniPlus } from "react-icons/hi2";
import * as Yup from "yup";
import { isEqual, map } from "es-toolkit/compat";

import {
  useAddSkillMutation,
  useDeleteSkillMutation,
} from "mangarine/state/services/profile.service";
import { useProfile } from "mangarine/state/hooks/profile.hook";
import CustomInput from "../customcomponents/Input";
import { toaster } from "../ui/toaster";
import TopRightDrawer from "../ui/top-right-drawer";

const skillsSchema = Yup.object().shape({
  name: Yup.string().required("Skill name is required"),
  skills: Yup.array()
    .of(Yup.string())
    .min(1, "At least 1 skill is required")
    .required("Skills are required"),
});

interface SkillObj {
  id: string;
  name: string;
  skills: string[];
  _new?: boolean;
}

// ---------- Input that adds pills on Enter ----------
const InputWithPills = ({
  value,
  onChange,
  setSkills,
}: {
  value: string[];
  onChange: (skills: string[]) => void;
  setSkills: (skills: string[]) => void;
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && inputValue.trim()) {
      const newSkills = [...value, inputValue.trim()];
      onChange(newSkills);
      setSkills(newSkills);
      setInputValue("");
    }
  };

  return (
    <VStack align="flex-start" w="full">
      <Text fontSize="0.75rem" color="text_primary" fontWeight="400">
        Skills
      </Text>
      <InputGroup>
        <Input
          px={4}
          placeholder="Enter skill and press Enter"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          color="text_primary"
          _placeholder={{ color: "gray.150", fontSize: "14px" }}
        />
      </InputGroup>
    </VStack>
  );
};

// ---------- Single skill item ----------
const SkillItem = ({
  skill,
  onClose,
  onRemove,
}: {
  skill: SkillObj;
  onClose: () => void;
  onRemove: () => void;
}) => {
  const [skills, setSkills] = useState<string[]>(skill.skills);
  const [addNewSkill, { isLoading }] = useAddSkillMutation();
  const [deleteSkill, { isLoading: deleteLoading }] = useDeleteSkillMutation();

  const { control, getValues } = useForm({
    resolver: yupResolver(skillsSchema),
    defaultValues: { name: skill.name, skills: skill.skills },
  });

  const handleSave = () => {
    const values = getValues();
    addNewSkill(values)
      .unwrap()
      .then((payload) => {
        toaster.create({
          title: "Success!",
          description: payload.message,
          type: "success",
          duration: 9000,
          closable: true,
        });
        onClose();
      })
      .catch(console.error);
  };

  const handleDelete = () => {
    // New unsaved form — just remove it
    if (skill._new) {
      onRemove();
      return;
    }
    deleteSkill(skill.id)
      .unwrap()
      .then((res) => {
        toaster.create({
          title: "Success!",
          description: res.message,
          type: "success",
          duration: 9000,
          closable: true,
        });
        onClose();
      })
      .catch((err) => {
        toaster.create({
          title: "Error!",
          description: err?.message || "Failed to delete skill",
          type: "error",
          duration: 9000,
          closable: true,
        });
      });
  };

  const handleRemovePill = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  return (
    <VStack w="full" p={5} borderWidth={1} rounded="15px" shadow="sm">
      {/* Skill Name */}
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            id={`skill_${skill.id}`}
            label="Skill Name"
            placeholder="Enter Skill Name"
            required
          />
        )}
      />

      {/* Skills Pills Input */}
      <Controller
        name="skills"
        control={control}
        render={({ field }) => (
          <InputWithPills
            value={field.value}
            onChange={field.onChange}
            setSkills={setSkills}
          />
        )}
      />

      {/* Pills */}
      {skills.length > 0 && (
        <HStack wrap="wrap" w="full" bg="primary.150" p={2} rounded="lg">
          {skills.map((s, idx) => (
            <Tag.Root
              borderColor="text_primary"
              borderWidth={0.5}
              key={idx}
              p={2}
              rounded="full"
            >
              <Tag.Label>{s}</Tag.Label>
              <Tag.CloseTrigger onClick={() => handleRemovePill(idx)} />
            </Tag.Root>
          ))}
        </HStack>
      )}

      {/* Buttons */}
      <HStack w="full" gap={4} pt={2}>
        <Button
          flex={1}
          rounded="6px"
          bg="transparent"
          borderWidth="1px"
          borderColor="primary.300"
          color="primary.300"
          loading={deleteLoading}
          onClick={handleDelete}
          h="44px"
        >
          Delete Skill
        </Button>
        <Button
          flex={1}
          rounded="6px"
          bg="#111D4A"
          borderColor="#111D4A"
          color="white"
          _hover={{ bg: "#111D4A" }}
          loading={isLoading}
          onClick={handleSave}
          h="44px"
        >
          Save Skill
        </Button>
      </HStack>
    </VStack>
  );
};

// ---------- Modal ----------
const SkillsModal = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: () => void;
}) => {
  const { skills } = useProfile();

  const makeNew = (): SkillObj => ({
    id: Date.now().toString(),
    name: "",
    skills: [],
    _new: true,
  });

  const [localSkills, setLocalSkills] = useState<SkillObj[]>([]);

  useEffect(() => {
    if (open) {
      setLocalSkills(
        skills?.length
          ? skills.map((s: any) => ({ ...s, _new: false }))
          : [makeNew()]
      );
    }
  }, [open, skills]);

  const handleAdd = () => {
    setLocalSkills((prev) => [...prev, makeNew()]);
  };

  const handleRemove = (id: string) => {
    setLocalSkills((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <TopRightDrawer
      open={open}
      onOpenChange={onOpenChange}
      title="Skills"
      headerAction={
        <Box
          as="button"
          borderWidth="1px"
          borderColor="input_border"
          rounded="6px"
          p={2}
          color="text_primary"
          _hover={{ bg: "bg_box" }}
          onClick={handleAdd}
        >
          <HiMiniPlus size={16} />
        </Box>
      }
      bodyProps={{
        px: { base: "4", lg: "5" },
        py: { base: "4", lg: "5" },
        pb: { base: "14", lg: "16" },
      }}
    >
      <VStack w="full" spaceY={4}>
        {map(localSkills, (skill) => (
          <SkillItem
            key={skill.id}
            skill={skill}
            onClose={onOpenChange}
            onRemove={() => handleRemove(skill.id)}
          />
        ))}
      </VStack>
    </TopRightDrawer>
  );
};

export default SkillsModal;
